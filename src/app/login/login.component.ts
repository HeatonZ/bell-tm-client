import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'core/auth';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    username: string;
    password: string;
    loginFailed: boolean;

    @ViewChild('u') usernameRef: ElementRef;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        public router: Router
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params.logout) {
                this.authService.logout();
            }
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.usernameRef.nativeElement.focus();
        }, 0);
    }

    login() {
        this.authService.login(this.username, this.password).subscribe(() => {
            if (this.authService.isLoggedIn) {
                const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';
                this.router.navigateByUrl(redirect);
            }
        }, (error) => {
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 401:
                        if (error.url.endsWith('/login?error')) {
                            this.loginFailed = true;
                        }
                        break;
                }
            }

        });
    }
}