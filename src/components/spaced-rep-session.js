import React from 'react';
import {connect} from 'react-redux';
import requiresLogin from './requires-login';
import {fetchQuestion, submitQuestion} from '../actions/questions';
import SpacedRepQuestion from './spaced-rep-question';
import SpacedRepAnswer from './spaced-rep-answer';
import SpacedRepFeedback from './spaced-rep-feedback';

import './spaced-rep-session.css'

export class SpacedRepSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedback:'',
            isCorrect: null
        };
      }

    componentDidMount() {
        this.props.dispatch(fetchQuestion());
    }

    onAnswerSubmit(input) {
        const answer = input.toLowerCase().trim();
        const correct = this.props.answer.toLowerCase();
        if (answer === correct) {
            this.setState({
                feedback: `${answer} is the correct translation of ${this.props.question}. Congratulations!`,
                isCorrect: true
            })
        } else {
            this.setState({
                feedback: `Sorry. ${answer} is not the correct translation. ${this.props.answer} is the correct English translation of ${this.props.question}`,
                isCorrect: false
            })
        }
    }

    onNextQuestion() {
        this.setState({
            feedback:'',
            isCorrect: null
        })
        this.props.dispatch(submitQuestion(this.state.isCorrect));
    }

    render() {
        const isFeedback = this.state.feedback;
        return (
            <div className="session">
                <span className="session-name">
                    Welcome {this.props.name}!
                </span>
                <div className="session-feedback">
                    {this.state.feedback}
                </div>
                <div className="session-qa">
                    <SpacedRepQuestion question={this.props.question}/>
                    {isFeedback ? (<SpacedRepFeedback onClick={() => this.onNextQuestion()} />)
                     : 
                     (<SpacedRepAnswer onClick={input => this.onAnswerSubmit(input)}/>)
                     }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    return {
        username: state.auth.currentUser.username,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        question: state.question.question,
        answer: state.question.answer
    };
};

export default requiresLogin()(connect(mapStateToProps)(SpacedRepSession));