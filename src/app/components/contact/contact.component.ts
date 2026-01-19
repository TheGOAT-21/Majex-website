import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.submitMessage = '';

    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.submitMessage = 'Merci pour votre message ! Nous vous recontacterons dans les 24 heures.';
      
      // Reset form
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

      // Clear message after 5 seconds
      setTimeout(() => {
        this.submitMessage = '';
      }, 5000);
    }, 2000);
  }
}
