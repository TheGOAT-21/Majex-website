import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AssetService, SiteAsset } from '../../../services/asset.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './media.component.html',
})
export class MediaComponent implements OnInit {
  private assetService = inject(AssetService);
  private fb = inject(FormBuilder);

  // ── État de la liste ───────────────────────────────────────────
  assets: SiteAsset[] = [];
  loading = true;
  activeCategory = 'all';

  // ── État du modal ──────────────────────────────────────────────
  showModal = false;
  editingAsset: SiteAsset | null = null;
  submitting = false;
  errorMessage = '';

  // ── État de l'upload ───────────────────────────────────────────
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  selectedFileName = '';

  // ── Configuration ──────────────────────────────────────────────
  categories = [
    { value: 'all',      label: 'Tous' },
    { value: 'logo',     label: 'Logos' },
    { value: 'hero',     label: 'Héro' },
    { value: 'about',    label: 'À propos' },
    { value: 'services', label: 'Services' },
    { value: 'partner',  label: 'Partenaires' },
  ];

  assetForm = this.fb.group({
    key:        ['', [Validators.required, Validators.pattern(/^[a-z0-9\-]+$/)]],
    category:   ['', Validators.required],
    label:      ['', Validators.required],
    alt_text:   [''],
    sort_order: [0],
    is_active:  [true],
  });

  // ── Cycle de vie ───────────────────────────────────────────────

  ngOnInit(): void {
    this.loadAssets();
  }

  // ── Chargement ─────────────────────────────────────────────────

  loadAssets(): void {
    this.loading = true;
    this.assetService.adminGetAll().subscribe({
      next: (data) => { this.assets = data; this.loading = false; },
      error: ()     => { this.loading = false; },
    });
  }

  // ── Résolution URL (relative → absolue) ───────────────────────

  resolveUrl(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${environment.apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // ── Filtrage ────────────────────────────────────────────────────

  get filteredAssets(): SiteAsset[] {
    if (this.activeCategory === 'all') return this.assets;
    return this.assets.filter(a => a.category === this.activeCategory);
  }

  countByCategory(cat: string): number {
    if (cat === 'all') return this.assets.length;
    return this.assets.filter(a => a.category === cat).length;
  }

  getCategoryLabel(cat: string): string {
    return this.categories.find(c => c.value === cat)?.label ?? cat;
  }

  // ── Modal ───────────────────────────────────────────────────────

  openCreateModal(): void {
    this.editingAsset = null;
    this.assetForm.reset({ sort_order: 0, is_active: true });
    this.assetForm.get('key')?.enable();
    this.selectedFile = null;
    this.previewUrl = null;
    this.errorMessage = '';
    this.showModal = true;
  }

  openEditModal(asset: SiteAsset): void {
    this.editingAsset = asset;
    this.assetForm.patchValue({
      key:        asset.key,
      category:   asset.category,
      label:      asset.label,
      alt_text:   asset.alt_text ?? '',
      sort_order: asset.sort_order,
      is_active:  asset.is_active,
    });
    this.assetForm.get('key')?.disable();
    this.selectedFile = null;
    this.previewUrl = null;
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAsset = null;
  }

  // ── Gestion du fichier ──────────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.setFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.setFile(file);
    }
  }

  /** Masque l'image cassée sans boucle infinie */
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  private setFile(file: File): void {
    this.selectedFile = file;
    this.selectedFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => { this.previewUrl = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  // ── Soumission du formulaire ────────────────────────────────────

  submitForm(): void {
    if (this.assetForm.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    const values = this.assetForm.getRawValue();

    Object.entries(values).forEach(([k, v]) => {
      if (v !== null && v !== undefined) {
        formData.append(k, v.toString());
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request$ = this.editingAsset
      ? this.assetService.adminUpdate(this.editingAsset.id, formData)
      : this.assetService.adminCreate(formData);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.closeModal();
        this.loadAssets();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.message ?? 'Une erreur est survenue';
      },
    });
  }

  // ── Actions rapides ─────────────────────────────────────────────

  toggleAsset(asset: SiteAsset): void {
    this.assetService.adminToggle(asset.id).subscribe({
      next: () => this.loadAssets(),
    });
  }

  deleteAsset(asset: SiteAsset): void {
    if (!confirm(`Supprimer "${asset.label}" ? Cette action est irréversible.`)) return;
    this.assetService.adminDelete(asset.id).subscribe({
      next: () => this.loadAssets(),
    });
  }
}