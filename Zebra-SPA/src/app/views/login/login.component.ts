import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../_service/auth.service';
import { AlertifyService } from '../../../../_service/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  model: any = {};
  loginType = ['Local', 'Domain', 'MyService'];

  constructor(private authService: AuthService, private alertify: AlertifyService,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.createLoginForm();
    if (this.authService.loggedIn()) {
      //this.router.navigate(['/default']);
    }
  }

  login() {
    this.model = Object.assign({}, this.loginForm.value);
    this.authService.login(this.model).subscribe(
      next => {
        this.alertify.success('Log in Successfully');
      },
      error => {
        this.alertify.error('Username or Password has error!');
      }, () => {
        this.router.navigate(['station']);
      }
    );
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      user_ID: ['', Validators.required],
      password: ['', Validators.required]
      //login_Type: [this.loginType[0], Validators.required]
    });
  }
  loggedIn() {
    return this.authService.loggedIn();
  }
  logout() {
    localStorage.clear();
    this.alertify.message('Logged out');
    this.router.navigate(['login']);
  }
}
