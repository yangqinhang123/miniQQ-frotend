import type { InjectionKey, Ref } from "vue";

export interface ContactListFlagType {
  isNeedToUpdateContactList: Ref<boolean>;
  setIsNeedToUpdateContactList: (value: boolean) => void;
}
export const contactListKey = Symbol(
  "contactListFlag"
) as InjectionKey<ContactListFlagType>;
