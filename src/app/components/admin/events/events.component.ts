import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnChanges {
  @Input() events: Event[] = [];
  @Input() loadingEvents = false;
  @Input() showEventModal = false;
  @Input() editingEvent: Partial<Event> | null = null;
  @Input() isNewEvent = false;

  @Output() openNew = new EventEmitter<void>();
  @Output() openEdit = new EventEmitter<Event>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Event>();
  @Output() publish = new EventEmitter<Event>();

  // ── État local image ────────────────────────────────────────────
  imagePreview: string | null = null;
  imageError = '';
  isDragOver = false;

  ngOnChanges(): void {
    if (this.showEventModal && this.editingEvent) {
      // Afficher l'image existante comme aperçu en mode édition
      if (this.editingEvent.image_url && !this.editingEvent._imageFile) {
        this.imagePreview = this.editingEvent.image_url;
      } else if (!this.editingEvent.image_url && !this.editingEvent._imageFile) {
        this.imagePreview = null;
      }
    }
    if (!this.showEventModal) {
      this.resetImageState();
    }
  }

  // ── Sélection via input file ────────────────────────────────────
  onFileSelected(event: globalThis.Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.processFile(input.files[0]);
      input.value = ''; // Permet de re-sélectionner le même fichier
    }
  }

  // ── Drag & Drop ─────────────────────────────────────────────────
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.processFile(file);
  }

  // ── Traitement fichier ──────────────────────────────────────────
  private processFile(file: File): void {
    this.imageError = '';

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.imageError = 'Format non supporté. Utilisez JPEG, PNG, GIF ou WebP.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.imageError = `Image trop lourde (${(file.size / 1024 / 1024).toFixed(1)} Mo). Max : 5 Mo.`;
      return;
    }

    // Stocker le fichier sur editingEvent pour que admin.component puisse l'envoyer
    if (this.editingEvent) {
      this.editingEvent._imageFile = file;
    }

    // Aperçu local immédiat
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ── Supprimer l'image ───────────────────────────────────────────
  removeImage(event: MouseEvent): void {
    event.stopPropagation();
    this.imagePreview = null;
    this.imageError = '';
    if (this.editingEvent) {
      this.editingEvent._imageFile = null;
      this.editingEvent.image_url = undefined;
    }
  }

  // ── Reset complet ───────────────────────────────────────────────
  resetImageState(): void {
    this.imagePreview = null;
    this.imageError = '';
    this.isDragOver = false;
  }

  // ── Fermer modal ────────────────────────────────────────────────
  onClose(): void {
    this.resetImageState();
    this.closeModal.emit();
  }
}