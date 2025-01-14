import { isToday, TASK_PRIORITY } from "@/assets/js/consts/constants";

export function getTodoPriority(todo) {
  const { important, urgent, deferred, done, repeated } = todo
  if(done) return TASK_PRIORITY.DONE
  if(deferred && !isToday(deferred)) {
    return TASK_PRIORITY.DEFERRED
  }
  if(important && !urgent) return TASK_PRIORITY.IMPORTANT
  if(urgent && !important || repeated && !important) return TASK_PRIORITY.URGENT
  if(important && urgent || important && repeated) return TASK_PRIORITY.IMP_AND_URG
  return TASK_PRIORITY.NORMAL
}
