import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { navItems } from '../../_nav';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../_service/auth.service';
import { AlertifyService } from '../../../../_service/alertify.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../_service/user.service';
import { PermissionGroup } from '../../../../_models/permissionGroup';
import { User } from '../../../../_models/user';
import { INavData } from '@coreui/angular';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  loginForm: FormGroup;
  model: any = {};
  adminItem: INavData = {};
  currentUser: User;
  isAdmin = false;
  permissionGroup: PermissionGroup[];
  loginType = ['Local', 'Domain', 'MyService'];
  public sidebarMinimized = false;
  public navItems = navItems;
  constructor(public authService: AuthService, private alertify: AlertifyService,
    private router: Router, private fb: FormBuilder, private userService: UserService,
    private changeDetectorRefs: ChangeDetectorRef) { }
  ngOnInit(): void {

    this.createLoginForm();
    if (this.authService.loggedIn()) {
      this.router.navigate(['station']);
      this.checkPermission();
    }


  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;

  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      user_ID: ['', Validators.required],
      password: ['', Validators.required],
      login_Type: [this.loginType[0], Validators.required]
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
  checkPermission() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.userService.getPermissionGroupsbyUser(this.currentUser.user_ID).subscribe((res: PermissionGroup[]) => {
      this.permissionGroup = res;
      for (let i = 0; i < this.permissionGroup.length; i++) {
        if (this.permissionGroup[i].group_Name.includes('tpm_admin')) {
          this.isAdmin = true;
        }
      }
    }, error => {
      console.log('get permission error');
    });
  }

  accessAdmin() {
    if (this.isAdmin) {
      this.router.navigate(['/zebraAdmin']);
    } else {
      this.alertify.warning('Your account is not admin account!', 5);
    }
  }
}
