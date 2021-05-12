import i18n from "@i18n";
import { WalletBackup_Recovery_QuestionEnum } from "dvote-js";

export const ALL_RECOVER_QUESTIONS = [
  {
    label: i18n.t('backup.STUFFED_TOY'),
    value: WalletBackup_Recovery_QuestionEnum.STUFFED_TOY,
  },
  {
    label: i18n.t('backup.FAVORITE_TEACHER'),
    value: WalletBackup_Recovery_QuestionEnum.FAVORITE_TEACHER,
  },
  {
    label: i18n.t('backup.DRIVING_INSTRUCTOR'),
    value: WalletBackup_Recovery_QuestionEnum.DRIVING_INSTRUCTOR,
  },
  {
    label: i18n.t('backup.FIRST_KISSED'),
    value: WalletBackup_Recovery_QuestionEnum.FIRST_KISSED,
  },
  {
    label: i18n.t('backup.CHILDHOOD_NICKNAME'),
    value: WalletBackup_Recovery_QuestionEnum.CHILDHOOD_NICKNAME,
  },
]