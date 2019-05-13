import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

// Rxjs components
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// Dashboard hub services and models
import { ProjectService } from '../../core/services/project.service';
import { ProjectModel } from '../../shared/models/index.model';

@Component({
    selector: 'dashboard-projects-create',
    templateUrl: './create-edit.component.html',
})
export class CreateEditProjectComponent implements OnInit {

    private createEditSubscription: Subscription;
    private projectSubscription: Subscription;
    private uid: string;
    public isEdit: Boolean = false;
    public projectForm: FormGroup;

    constructor(
        private router: Router,
        private form: FormBuilder,
        private snackBar: MatSnackBar,
        private projectService: ProjectService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.uid = this.route.snapshot.paramMap.get('uid');
        this.projectForm = this.form.group({
            type: [undefined, [Validators.required]],
            title: [undefined, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            description: [undefined, [Validators.minLength(3), Validators.maxLength(1024)]],
        });
        if (this.uid) {
            this.isEdit = true;
            this.projectSubscription = this.projectService
                .findOneById(this.uid)
                .subscribe((project: ProjectModel) => this.projectForm.reset(project));
        }
    }

    // This function will create project and edit project details based upon if click on edit or add
    save(): void {
        if (this.uid) {
            this.createEditSubscription = this.projectService
                .save({ uid: this.uid, ...this.projectForm.getRawValue() })
                .pipe(
                    catchError((error: any): any => this.snackBar.open(error.message, undefined, { duration: 5000 }))
                )
                .subscribe(() => this.router.navigate(['/projects', this.uid]));
        } else {
            this.createEditSubscription = this.projectService
                .create(this.projectForm.getRawValue())
                .pipe(
                    catchError((error: any): any => this.snackBar.open(error.message, undefined, { duration: 5000 }))
                )
                .subscribe((project: ProjectModel) => this.router.navigate(['/projects', project.uid]));
        }
    }

    ngDestroy(): void {
        this.createEditSubscription.unsubscribe();
        this.projectSubscription.unsubscribe();
    }
}