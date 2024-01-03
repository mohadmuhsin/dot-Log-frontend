import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  formData!:FormGroup;
  user!: SocialUser;
  alertMessage!:string;
  alertTYpe!:string;  
  alert:boolean = false;
  condition: boolean = true
  userdata!: { password: string;  username: string; };
  passwordPattern: any = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  

  constructor(
    private router :Router,
    private formBuilder:FormBuilder,
    private service : AuthServiceService,
    private authService: SocialAuthService,

    ){}

ngOnInit(): void {
  this.formData = this.formBuilder.group({
    username:["",[Validators.required, Validators.minLength(3)]],
    password:["",[Validators.required,Validators.minLength(8), Validators.pattern(this.passwordPattern)]]
  })

  this.authService.authState.subscribe((user) => {
    this.user = user;
    if (this.user) {
      this.userdata = { 
        password : this.user.id, 
        username : this.user.name
      }
      this.googleLogin()
    }
  });
}


googleLogin(){
  this.service.login(this.userdata,true).subscribe({
    next:(res:any)=>{
      this.alert = true
      this.condition = true
      this.alertTYpe = "Success alert!"
      this.alertMessage = res.message;
      setTimeout(() => {
        this.alert = false;
        this.router.navigate(['/'])
      }, 5000);
    },
    error:(err)=>{
      console.log(err);
      this.alert = true
      this.condition = false
      this.alertTYpe = "Warning alert!"
      this.alertMessage = err.error.message;
      setTimeout(() => {
        this.condition = false
        this.alert = false;
      }, 5000);
    }
  })
}

login(){
  if(this.formData.valid){
    let authData = this.formData.getRawValue()
    this.service.login(authData, false).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.alert = true
        this.condition = true
        this.alertTYpe = "Success alert!"
        this.alertMessage = res.message;
        setTimeout(() => {
          this.alert = false;
          this.router.navigate(['/'])
        }, 1000);
      },
      error:(error)=>{
        console.log(error);
        this.alert = true
        this.condition = false
        this.alertTYpe = "Warning alert!"
        this.alertMessage = error.error.message;
        setTimeout(() => {
          this.alert = false;
        }, 5000);
      }
    })

  }else{
    this.alert = true
    this.condition = false
    this.alertTYpe = "Warning alert!"
    this.alertMessage = "Feilds can't be empty";
    // setTimeout(() => {
    //   this.alert = false;
    // }, 5000);
  }
}

}
