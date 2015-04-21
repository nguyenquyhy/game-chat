export class AppViewModel {
    password: KnockoutObservable<string>;
    sources: KnockoutObservableArray<ISourceModel>;
    selectedSource: KnockoutComputed<ISourceModel>;

    isReady: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;

    source: ISourceModel;

    isChatLoading: KnockoutObservable<boolean>;
    isChatReady: KnockoutObservable<boolean>;
    chatMessages: KnockoutObservableArray<IChatMessage>;

    constructor() {
        this.password = ko.observable(null);
        this.sources = ko.observableArray([]);
        this.selectedSource = ko.pureComputed({
            read: () => {
                return this.source;
            },
            write: (value: ISourceModel) => {
                if (this.source !== value) {
                    this.source = value;
                    this.sourceSelected();
                }
            },
            owner: this
        });

        this.isReady = ko.observable(false);
        this.isLoading = ko.observable(false);

        this.isChatLoading = ko.observable(false);
        this.isChatReady = ko.observable(false);
        this.chatMessages = ko.observableArray([]);
    }

    start() {
        this.isReady(false);
        this.isLoading(true);
        this.chatMessages.removeAll();
        this.getSource();
    }

    getSource() {
        $.ajax('api/Sources', {
            success: (data: ISourceModel[], status, xhr) => {
                this.sources.removeAll();
                $.each(data,(index, item) => this.sources.push(item));
                this.isReady(true);
                this.isLoading(false);
            },
            error: (xhr, status, errorString) => {
                alert('Cannot get source! ' + errorString);
                this.isLoading(false);
            },
            headers: {
                "Authorization": this.password()
            }
        });
    }

    sourceSelected() {
        if (this.source !== null) {
            var sourceKey = this.source.key;

            this.isChatLoading(true);

            this.isChatReady(true);
        }
        else {
            this.isChatReady(false);
        }
    }
}