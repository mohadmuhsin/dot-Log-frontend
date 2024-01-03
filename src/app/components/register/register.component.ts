import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements OnInit{
  formData!: FormGroup;
  user!: SocialUser;
  alertMessage!:string;
  alertTYpe!:string;  
  alert:boolean = false;
  condition: boolean = true;
  passwordPattern: any = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  userdata!: { password: string; email: string; username: string; };

  constructor( 
    private authService: SocialAuthService,
    private service :AuthServiceService,
    private formBuilder: FormBuilder, 
    private router:Router
  ){}

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      username:["",[Validators.required,Validators.minLength(3),]],
      email:["",[Validators.required, Validators.email]],
      password:["",[Validators.required,Validators.pattern(this.passwordPattern), Validators.minLength(8)]]
    })

    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.userdata = { 
          password : this.user.id, 
          email : this.user.email, 
          username : this.user.name
         }
         this.googleRegister()
      }
      
    });
  }

  googleRegister(){
    this.service.register(this.userdata,true).subscribe({
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
      error:(err)=>{
        console.log(err);
        this.alert = true
        this.condition = false
        this.alertTYpe = "Warning alert!"
        this.alertMessage = err.error.message;
        // setTimeout(() => {
        //   this.condition = false
        //   this.alert = false;
        // }, 5000);
      }
    })
  }

  register(){
    if(this.formData.valid){
      let authData = this.formData.getRawValue()
      this.service.register(authData, false).subscribe({
        next:(res:any)=>{
          console.log(res,"registration successfull");
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
            this.condition = false
            this.alert = false;
          }, 5000);
        }
      })
    }else{
      this.alert = true
      this.condition = false
      this.alertTYpe = "Warning alert!"
      this.alertMessage = "Feilds can't be empty";
    }
  }
}
