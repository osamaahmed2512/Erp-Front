import { Component } from '@angular/core';
import { AuthService } from '../../../../Core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { LoginRequestDto } from '../../models/auth';
import { TokenService } from '../../../../Core/services/token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccessStore } from '../../../../Core/services/access-store.service';
@Component({
  selector: 'app-login.component',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone:true
})
export class LoginComponent {
 email:string ="";
 password:string="";

constructor(private _authService:AuthService 
  , private _tokenService:TokenService
, private router:Router,
  private toastr: ToastrService,
  private accessStore: AccessStore ){
  
}


  login(){
  const data :LoginRequestDto = {
      email:this.email  ,
      password:this.password
  }
  this._authService.logIn(data).subscribe({
      next: (res) => {
    this._tokenService.setToken(
      res.data.token,
      res.data.refreshToken,
      res.data.expiresAt,
      res.data.expiresRefreshTokenAt,
      res.data.sessionExpiryTime
    );

    this.accessStore.initialize().subscribe({
      next: () => this.router.navigateByUrl(this.accessStore.firstRoute()),
      error: () => this.router.navigate(['/access-denied'])
    });
      },
      error: (err) => {
        console.log(err);
              this.toastr.error(
        err.error.message,
        "Login Failed"
      );
      }
  })
  }

}
