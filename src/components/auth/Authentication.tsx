import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";

import useRealm from "../../hooks/useRealm";
import * as Realm from "realm-web";
import { Link, useNavigate } from "react-router-dom";
import { realmFunctionNames } from "../../data/realm/functions";

import useTheme from "../../hooks/useTheme";
import { ThemeEnum } from "../../context/ThemeContext";

import DarkLogo from "../../assets/Logo/dark/hereIam_logo_dark256x256.svg";
import LightLogo from "../../assets/Logo/light/hereIam_logo_light256x256.svg";

import useMission from "../../hooks/useMission";
import { MissionSchema } from "../../data/realm/schema/mission";
import useNavigation from "../../hooks/useNavigation";

import styled from "styled-components";

import { useTranslation } from "react-i18next";

// define the schema / rules for the register form validation
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "Invalid password").required("Required"),
});

// define the schema / rules for the form validation
const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "Too short!").required("Required"),
});

// create a type for the values in the login form
type LoginFormValuesType = {
  email: string;
  password: string;
};

type RegisterFormValuesType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const Authentication = () => {
  const { currentTheme } = useTheme();
  let navigate = useNavigate();
  const { realm } = useRealm();
  const { setActiveMission } = useMission();
  const { setIsDrawOpen } = useNavigation();

  // state for whether the login or register form should be rendered
  const [isLogin, setIsLogin] = useState<boolean>(true);

  // initalize a loading state to conditionally render a loading indicator component
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // function that is called upon form submission, tries to login the user in realm
  const handleSubmit = async (values: LoginFormValuesType) => {
    try {
      setError(false);
      setLoading(true);

      const credentials = Realm.Credentials.emailPassword(
        values.email,
        values.password
      );

      await realm.logIn(credentials);

      if (realm.currentUser) {
        await realm.currentUser.refreshCustomData();

        const response: MissionSchema = await realm.currentUser.callFunction(
          realmFunctionNames.getCurrentMission,
          {}
        );

        if (response._id) {
          await realm.currentUser.refreshCustomData();

          setActiveMission(response as MissionSchema);

          navigate("/mission");
        } else {
          navigate("/");
        }

        setLoading(false);
        setIsDrawOpen(false);
      }
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  // function that is called upon form submission, tries to register the user in realm
  const handleRegister = async (values: RegisterFormValuesType) => {
    try {
      setError(false);
      setLoading(true);

      // register the new user
      await realm.emailPasswordAuth.registerUser({
        email: values.email,
        password: values.password,
      });

      // use the same email and password used for registering as credentials for the login
      const credentials = Realm.Credentials.emailPassword(
        values.email,
        values.password
      );

      // log the new user in
      await realm.logIn(credentials);

      if (realm.currentUser) {
        const args = { firstName: values.firstName, lastName: values.lastName };

        await realm.currentUser.callFunction(
          realmFunctionNames.updateCustomData,
          args
        );

        await realm.currentUser.refreshCustomData();

        setLoading(false);

        navigate("/");
        setIsDrawOpen(false);
      }
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  const { t } = useTranslation();

  return (
    <StyledDrawWrapper>
      <StyledLogoWrapper>
        <StyledLogo
          src={currentTheme === ThemeEnum.LIGHT ? DarkLogo : LightLogo}
        />
        <StyledCompanyName>hereIam</StyledCompanyName>
      </StyledLogoWrapper>

      {isLogin ? (
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <StyledForm onChange={() => setError(false)}>
              <StyledField name="email" type="email" placeholder="Email" />
              {errors.email && touched.email ? (
                <StyledInlineErrorMessage>
                  {errors.email}
                </StyledInlineErrorMessage>
              ) : null}

              <StyledField
                name="password"
                type="password"
                placeholder="Password"
              />
              {errors.password && touched.password ? (
                <StyledInlineErrorMessage>
                  {errors.password}
                </StyledInlineErrorMessage>
              ) : null}

              <StyledButton type="submit">
                {loading ? "loading..." : error ? "Invalid login" : "Log In"}
              </StyledButton>
              
              {/*notice terms and privacy policy */}
              <StyledHint>{t("Login.hint")}</StyledHint>

              {/* add passwort reset function */}

              <StyledAlternatives>

                <StyledSwitchButton onClick={() => setIsLogin(false)}>
                  {t("Login.noaccount")}<br />
                  {t("Login.signup")}
                </StyledSwitchButton>

                <StyledSocialLogin>
                  {t("Login.prefer")}<br />
                  {t("Login.soon")}
                </StyledSocialLogin>

              </StyledAlternatives>

              <StyledLink to="/auth-about">{t("Login.about")}</StyledLink>
            
            </StyledForm>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ errors, touched }) => (
            <StyledForm onChange={() => setError(false)}>
              <StyledField name="firstName" placeholder="First Name" />
              {errors.firstName && touched.firstName ? (
                <StyledInlineErrorMessage>
                  {errors.firstName}
                </StyledInlineErrorMessage>
              ) : null}

              <StyledField name="lastName" placeholder="Last Name" />
              {errors.lastName && touched.lastName ? (
                <StyledInlineErrorMessage>
                  {errors.lastName}
                </StyledInlineErrorMessage>
              ) : null}

              <StyledField name="email" type="email" placeholder="Email" />
              {errors.email && touched.email ? (
                <StyledInlineErrorMessage>
                  {errors.email}
                </StyledInlineErrorMessage>
              ) : null}

              <StyledField
                name="password"
                type="password"
                placeholder="Password"
              />
              {errors.password && touched.password ? (
                <StyledInlineErrorMessage>
                  {errors.password}
                </StyledInlineErrorMessage>
              ) : null}

              <StyledButton type="submit">
                {loading ? "loading..." : error ? "Invalid login" : "Register"}
              </StyledButton>

              <StyledSwitchButton onClick={() => setIsLogin(true)}>
                {t("Login.have")}
              </StyledSwitchButton>

              <StyledLink to="/auth-about">{t("Login.about")}</StyledLink>
            </StyledForm>
          )}
        </Formik>
      )}
      <StyledBottomSpacer />
    </StyledDrawWrapper>
  );
};

const StyledDrawWrapper = styled.div`
  margin-top: 2rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
`;

const StyledLogoWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledLogo = styled.img`
  height: 12vh;
  width: 12vh;
`;

const StyledCompanyName = styled.p`
  font-weight: 600;
  font-size: 2rem;
`;

const StyledForm = styled(Form)`
  /* width: 90%; */
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  gap: 0.5rem;
`;

const StyledField = styled(Field)`
  background-color: ${(props) => props.theme.primaryBackgroundColor};
  border: 1px solid ${(props) => props.theme.formFieldColor};
  border-radius: ${(props) => props.theme.inputBorderRadius};
  color: ${(props) => props.theme.formFieldColor};
  font-size: 1rem;
  line-height: 1.5rem;
  font-style: normal;
  font-weight: 500;
  width: 100%;
  margin-top: 0.6rem;
  padding: 0.75rem 0.75rem;
`;

const StyledInlineErrorMessage = styled.div`
  color: ${(props) => props.theme.alertColor};
  font-weight: 500;
  margin-top: 0.3rem;
`;

const StyledButton = styled.button`
  width: 60%;
  height: 3rem;

  margin-top: 1.5rem;

  font-weight: 700;
  text-align: center;

  color: ${(props) => props.theme.buttonFontColor};
  background-color: ${(props) => props.theme.buttonColor};

  border: 1px solid ${(props) => props.theme.formSubmitBorderColor};
  border-radius: ${(props) => props.theme.inputBorderRadius};
`;

const StyledBottomSpacer = styled.div`
  height: 50vh;
`;

const StyledSwitchButton = styled.button`
  margin-top: 1rem;
  font-size: 0.7rem;
  font-weight: 500;
`;

const StyledSocialLogin = styled.div`
  margin-top: 1rem;
  font-size: 0.7rem;
  font-weight: 500;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.primaryFontColor};
  text-decoration: none;
  margin-top: 1rem;
`;

const StyledHint = styled.div`
  margin-top: 1rem;
  width: 100%;
  padding: 0.7rem;

  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
`;

const StyledAlternatives = styled.div`
  margin-top: 1rem;
  width: 100%;
  padding-top: 0.5rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-top: solid 1px ${(props) => props.theme.primaryFontColor};
`;

export default Authentication;
