import React, { Component } from 'react';
import classes from './Auth.module.css';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import Button from '../../components/UI/Button/Button';
import Banner from '../../components/UI/Banner/Banner';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
class Auth extends Component {
  state = {
    controls: {
      userName: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your First Name',
          label: 'Name',
        },
        value: '',
        validation: {
          required: true,
          minLength: 3,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email Address',
          label: 'Email',
        },
        value: '',
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Your Password',
          label: 'Password',
        },
        value: '',
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
    isRegister: true,
    isformValid: false,
    isLoading: false,
  };

  /**
   * Deals with how the inputs update the value on the state
   */
  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      },
    };
    this.setState({ controls: updatedControls });
  };

  /**
   * Handler for checking if an input is valid
   * @param {value of input field} value
   * @param {rules from state} rules
   */
  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = pattern.test(value) && isValid;
    }
    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }
    return isValid;
  }

  /**
   * Called when user clicks button to submit login/register event
   */
  onSubmitHandler = (event) => {
    event.preventDefault();
    if (this.state.isRegister) {
      let data = {
        name: this.state.controls.userName.value,
        email: this.state.controls.email.value,
        password: this.state.controls.password.value,
      };
      this.setState({ showLoader: true });
      axios
        .post('/user/create', data)
        .then((res) => {
          if (res.data.data.success) {
            this.setState({
              showLoader: false,
              showMessage: false,
              isRegister: false,
            });
          }
        })
        .catch((err) => {
          this.setState({
            showLoader: false,
            showMessage: true,
            isRegister: true,
          });
        });
    } else {
      let data = {
        email: this.state.controls.email.value,
        password: this.state.controls.password.value,
      };
      this.setState({ showLoader: true });
      axios
        .post('/user/login', data)
        .then((res) => {
          if (res.data.data.success) {
            this.setState({
              showLoader: false,
              showMessage: false,
              isRegister: false,
            });
          }
        })
        .catch((err) => {
          this.setState({
            showLoader: false,
            showMessage: true,
            isRegister: true,
          });
        });
    }
  };

  /**
   * Changes the from to/from login and register
   */
  changeFormHandler = () => {
    if (this.state.isRegister) {
      this.setState({ isRegister: false });
    } else if (!this.state.isRegister) {
      this.setState({ isRegister: true });
    }
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }
    const registerForm = formElementsArray.map((formElement) => {
      return (
        <Input
          label={formElement.config.elementConfig.label}
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={(event) => this.inputChangedHandler(event, formElement.id)}
        />
      );
    });
    const loginForm = formElementsArray.slice(1, 3).map((formElement) => {
      return (
        <Input
          label={formElement.config.elementConfig.label}
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={(event) => this.inputChangedHandler(event, formElement.id)}
        />
      );
    });
    const button = (
      <Button
        btnType={'Login'}
        disabled={!this.state.formValid}
        clicked={(event) => this.submitHandler(event)}
      >
        {!this.state.formValid ? 'Disabled' : 'Submit'}
      </Button>
    );
    return (
      <div className={classes.Auth}>
        <section className={classes.Header}>
          <Banner>Tasty Coffe Rewards</Banner>
        </section>
        <section className={classes.FormContainer}>
          <Button btnType={'General'} clicked={this.changeFormHandler}>
            Go to {this.state.isRegister ? 'Login' : 'Register'}
          </Button>
          <h2>{!this.state.isRegister ? 'Login' : 'Register Now'}</h2>
          <form>
            {this.state.isRegister ? registerForm : loginForm}
            {button}
          </form>
        </section>
      </div>
    );
  }
}

export default withErrorHandler(Auth, axios);
