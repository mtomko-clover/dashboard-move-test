import React, {Component} from "react";

import {BigCard} from "../BigCard";
import NewsUpdate from "../../models/NewsUpdate";
import NewsUpdateRow from "./Row";
import {NEWS_CATEGORIES} from "../../models/NewsCategories";

import {Heading, NewsDate, Title, Type} from "./News.styles";

import '../TimeTracker.css';
import {List} from "antd";
import CreateNewsUpdate from "./CreateNewsUpdate";
import {CookiesUtil} from "../../utils/CookiesUtil";
import {Cookies} from "../../utils/Cookies";
import ViewUpdate from "./ViewUpdate";


interface State {
    updates: NewsUpdate[];
    showUpdateCreate: boolean
    showViewNews: boolean
    update: NewsUpdate | null
}


let dummyData =[
    new NewsUpdate ("ram.kavasseri", new Date(), "MiCamp multipay tokens issue and GrubHub", NEWS_CATEGORIES.Escalation,
        "The next movement in paragraph development is an explanation of each example and its relevance to the topic sentence and rationale that were stated at the beginning of the paragraph. This explanation shows readers why you chose to use this/or these particular examples as evidence to support the major claim, or focus, in your paragraph.\n" +
        "\n" +
        "Continue the pattern of giving examples and explaining them until all points/examples that the writer deems necessary have been made and explained. NONE of your examples should be left unexplained. You might be able to explain the relationship between the example and the topic sentence in the same sentence which introduced the example. More often, however, you will need to explain that relationship in a separate sentence."),
    new NewsUpdate ("ram.kavasseri", new Date(), "Altria/Smokin Rebates concept - pending", NEWS_CATEGORIES.Issue),
    new NewsUpdate ("ram.kavasseri", new Date(), "DART: Progress on new DevRel Dashboard design", NEWS_CATEGORIES.DevRel),
    new NewsUpdate ("ram.kavasseri", new Date(), "COE: Organized and announced to the team", NEWS_CATEGORIES.DevRel),
    new NewsUpdate ("ram.kavasseri", new Date(), "ECommerce documentation moving forward", NEWS_CATEGORIES.Content),
    new NewsUpdate ("ram.kavasseri", new Date(), "DevsRock: First wave email updates to devs", NEWS_CATEGORIES.DevRel),
    new NewsUpdate ("ram.kavasseri", new Date(), "Developer Advocate responsibilities conflict", NEWS_CATEGORIES.DevRel),
    new NewsUpdate ("ram.kavasseri", new Date(), "Ireland Team Training", NEWS_CATEGORIES.Engineering),
    new NewsUpdate ("ram.kavasseri", new Date(), "Sandbox to GCP testing in progress", NEWS_CATEGORIES.DevRel)
];

export default class News extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            updates: dummyData,
            showUpdateCreate: false,
            showViewNews: false,
            update: null
        };
        this.modalClosed = this.modalClosed.bind(this);
        this.closeView = this.closeView.bind(this);
        this.showCreateUpdate = this.showCreateUpdate.bind(this);
        this.updateClicked = this.updateClicked.bind(this);
    }

    showCreateUpdate(){
        this.setState({showUpdateCreate: true, update: null});
    }

    addUpdate(update: NewsUpdate){
        console.log("Update:", update);
        dummyData.push(update);
    }

    modalClosed(): void {
        this.setState({showUpdateCreate: false});
    }

    closeView(): void {
        this.setState({showViewNews: false});
        console.log("closeView called");
    }

    updateClicked(update: NewsUpdate) : void {
        console.log("update clicked", update);
        let username = CookiesUtil.getCookie(Cookies.USERNAME);
        if(username === update.username){
            this.setState( {update: update , showUpdateCreate : true});
        } else {
            this.setState({showViewNews: true, update: update});
        }
    }

    addNewsUpdate(){

    }

    renderUpdates = (): Array<JSX.Element> => this.state.updates.map((update, i) => <NewsUpdateRow key={i} update={update} />);

    renderViewUpdate(): React.ReactElement {
        if(this.state.showViewNews && this.state.update){
            return (<ViewUpdate showModal={this.state.showViewNews} modalClosed={this.closeView} update={this.state.update}/>);
        } else {
            return <div/>
        }
    }

    render(): React.ReactNode {
        const addNewsItem = (<div onClick={this.showCreateUpdate}><i className="fas fa-plus margin-after"/></div>);
        return (
            <BigCard title="News" headerChild={addNewsItem}>
                {this.state.showUpdateCreate && <CreateNewsUpdate update={this.state.update} showModal={this.state.showUpdateCreate} modalClosed={this.modalClosed} saveNewUpdate={this.addUpdate}/>}
                {this.renderViewUpdate()}
                <Heading>
                    <NewsDate>Date</NewsDate>
                    <Title>Title</Title>
                    <Type>Type</Type>
                </Heading>
                <List
                    className="width_95 margin-bottom"
                    itemLayout="horizontal"
                    dataSource={dummyData}
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 7,
                        position:"bottom"
                    }}
                    renderItem={update => (
                        <List.Item onClick={() => this.updateClicked(update)}>
                            <NewsUpdateRow update={update}/>
                        </List.Item>
                    )}
                />
                <button onClick={this.addNewsUpdate}>add new</button>
            </BigCard>
        )
    }
}
