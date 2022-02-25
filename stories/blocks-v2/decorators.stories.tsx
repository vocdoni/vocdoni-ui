import i18n from "@i18n";
import { storiesOf } from "@storybook/react";
import { I18nextProvider } from "react-i18next";

storiesOf('Blocks V2', module)
.addDecorator(story => <I18nextProvider i18n={i18n}>{story()}</I18nextProvider>)
// .add('app view', () => <App />);
