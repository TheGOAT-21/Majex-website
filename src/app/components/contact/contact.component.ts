import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
    consent: false
  };

  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  constructor(private contactService: ContactService) {}

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.submitMessage = '';

    // Préparer les données (combiner prénom + nom)
    const messageData = {
      name: `${this.formData.firstName} ${this.formData.lastName}`,
      email: this.formData.email,
      phone: this.formData.phone,
      subject: this.formData.service || 'Demande générale',
      message: `Budget: ${this.formData.budget || 'Non défini'}\nEntreprise: ${this.formData.company || 'N/A'}\n\n${this.formData.message}`
    };

    // Envoyer au backend
    this.contactService.sendMessage(messageData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.submitMessage = response.message || 'Message envoyé avec succès !';
        
        // Réinitialiser le formulaire
        this.formData = {
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          phone: '',
          service: '',
          budget: '',
          message: '',
          consent: false
        };

        // Effacer le message après 5 secondes
        setTimeout(() => {
          this.submitMessage = '';
        }, 5000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.submitSuccess = false;
        this.submitMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        console.error('Erreur:', err);
      }
    });
  }
}