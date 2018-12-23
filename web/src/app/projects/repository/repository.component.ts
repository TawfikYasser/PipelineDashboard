import { Component, OnInit, Input } from '@angular/core';
import { ProjectModel, RepositoryModel } from '../../../models/index.model';
import { Subscription } from 'rxjs';
import { RepositoryService } from '../../../services/repository.service';

@Component({
    selector: 'dashboard-repository',
    templateUrl: './repository.component.html',
    styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit {

    private repositorySubscription: Subscription;

    @Input()
    public uid: string;

    public repository: RepositoryModel = new RepositoryModel('');

    constructor(
        private repositoryService: RepositoryService
    ) {
    }

    ngOnInit(): void {
        this.repositorySubscription = this.repositoryService
            .findOneById(this.uid)
            .subscribe((repository: RepositoryModel) => this.repository = repository);
    }

    ngDestroy(): void {
        this.repositorySubscription
            .unsubscribe();
    }
}
