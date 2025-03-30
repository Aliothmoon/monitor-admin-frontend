import { Ref, ref } from "vue";

export function useTrigger(): [
  Ref<boolean, boolean>,
  () => void,
  () => void,
  () => void
] {
  const status = ref(false);
  return [
    status,
    () => {
      status.value = true;
    },
    () => {
      status.value = false;
    },
    () => {
      status.value = !status.value;
    },
  ];
}
