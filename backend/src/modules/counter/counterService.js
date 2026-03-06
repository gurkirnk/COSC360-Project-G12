import {
  getCounterEventCount,
  getCounterTotal,
  insertCounterValue,
} from "./counterRepository.js";

export async function addOneToCounter() {
  const inserted = await insertCounterValue(1);
  const total = await getCounterTotal();
  const events = await getCounterEventCount();

  return {
    insertedId: inserted.id,
    insertedValue: inserted.value,
    total,
    events,
  };
}
