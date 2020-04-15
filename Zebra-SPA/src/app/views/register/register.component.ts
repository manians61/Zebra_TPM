import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../_models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../_service/auth.service';
import { AlertifyService } from '../../../../_service/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  constructor(private authService: AuthService, private alertify: AlertifyService,
    private fb: FormBuilder, private router: Router) { }
  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      user_ID: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]

    }, { validator: this.passwordMatchValidator });
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true };
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      console.log(this.user);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Register Successfull!');
      }, error => {
        this.alertify.error('error');
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['station']);
        });
      });
    }

  }
  cancel() {
    this.cancelRegister.emit(false);
  }

}
