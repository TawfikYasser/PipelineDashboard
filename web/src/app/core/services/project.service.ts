import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { tap, switchMap } from 'rxjs/operators';

// Dashboard model and services
import { ProjectModel, RepositoryModel } from '../../shared/models/index.model';
import { AuthenticationService } from './authentication.service';
import { SpinnerService } from './spinner.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    constructor(
        private afs: AngularFirestore,
        private authService: AuthenticationService,
        private spinnerService: SpinnerService
    ) {
    }

    // This function is for creating the project for logged in user
    public create(data: ProjectModel): Observable<ProjectModel> {
        let project: ProjectModel = {
            uid: uuid(),
            access: { admin: [this.authService.profile.uid] },
            ...data,
            repositories: [],
            createdOn: new Date(),
            updatedOn: new Date(),
        };

        return from(
            this.afs.collection<ProjectModel>('projects')
                .doc(project.uid)
                .set(project)
        )
            .pipe(
                tap(() => this.spinnerService.setProgressBar(true)),
                () => of(project)
            );
    }

    // This function delete the project via uid
    public delete(uid: string): Observable<void> {
        return from(
            this.afs
                .collection<ProjectModel>('projects')
                .doc<ProjectModel>(uid)
                .delete()
        );
    }

    // This function returns the public projects list
    public findPublicProjects(): Observable<ProjectModel[]> {
        return this.spinnerService
            .start()
            .pipe(
                switchMap(() => this.afs
                    .collection<ProjectModel>(
                        'projects',
                        (ref: firebase.firestore.Query) => ref.where('type', '==', 'public')
                        .orderBy('updatedOn', 'desc')
                    )
                .valueChanges())
            );
    }

    // This function returns the private projects list
    public findMyProjects(): Observable<ProjectModel[]> {
        return from(this.afs
            .collection<ProjectModel>(
                'projects',
                (ref: firebase.firestore.Query) => ref.where('access.admin', 'array-contains', this.authService.profile.uid)
                    .orderBy('updatedOn', 'desc')
            )
            .valueChanges()
        );
    }

    // This function returns the project details via id
    public findOneById(uid: string): Observable<ProjectModel> {
        return from(this.afs.collection<ProjectModel>('projects').doc<ProjectModel>(uid).valueChanges());
    }

    // This function update the project details
    public save(project: ProjectModel): Observable<void> {
        this.spinnerService.setProgressBar(true);
        return from(
            this.afs
                .collection<ProjectModel>('projects')
                .doc<ProjectModel>(project.uid)
                .set({ ...project, updatedOn: new Date() }, { merge: true })
        );
    }

    // This function add the repository in any project
    public saveRepositories(uid: string, repositories: string[]): Observable<void> {
        return from(
            this.afs
                .collection<ProjectModel>('projects')
                .doc<ProjectModel>(uid)
                .set(
                    {
                        repositories: repositories.map((repoUid: string) => new RepositoryModel(repoUid).uid),
                        updatedOn: new Date(),
                    },
                    { merge: true })
        );
    }
}
