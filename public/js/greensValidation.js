/**
 * Greens Entry Form Validation
 * Provides client-side validation for the greens entry form
 */

class GreensFormValidator {
  constructor() {
    this.form = document.getElementById('greensForm');
    this.initialize();
  }

  initialize() {
    if (!this.form) return;
    
    // Setup event listeners
    this.form.addEventListener('submit', this.validateForm.bind(this));
    
    // Real-time validation for numeric fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', this.validateNumberField.bind(this));
    });
  }

  validateForm(e) {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = [
      'DcNumber', 
      'DcDate', 
      'vendor_name'
    ];
    
    requiredFields.forEach(field => {
      const element = document.getElementById(field);
      if (!element.value.trim()) {
        this.showFieldError(element, 'This field is required');
        isValid = false;
      } else {
        this.clearFieldError(element);
      }
    });

    // Validate numeric fields
    const numericFields = [
      'D160plus', 'D100plus', 'D30plus', 'D30minus',
      'F160plus', 'F100plus', 'F30plus', 'F30minus'
    ];
    
    numericFields.forEach(field => {
      const element = document.getElementById(field);
      if (element.value && isNaN(element.value)) {
        this.showFieldError(element, 'Must be a valid number');
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      this.showAlert('Please fix the errors in the form', 'danger');
    }
    
    return isValid;
  }

  validateNumberField(e) {
    const field = e.target;
    if (field.value && isNaN(field.value)) {
      this.showFieldError(field, 'Must be a number');
    } else {
      this.clearFieldError(field);
    }
  }

  showFieldError(element, message) {
    const feedback = element.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.className = 'invalid-feedback';
      feedbackDiv.textContent = message;
      element.classList.add('is-invalid');
      element.after(feedbackDiv);
    }
  }

  clearFieldError(element) {
    element.classList.remove('is-invalid');
    const feedback = element.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.remove();
    }
  }

  showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insert at top of form
    this.form.prepend(alertDiv);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GreensFormValidator();
});
