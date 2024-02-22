import { addKey } from '../components/redis';

(async () => {
  await addKey('125ab660-5ff6-11ed-9b6a-0242ac120002');
  await addKey('125ac0e2-5ff6-11ed-9b6a-0242ac120002');
  await addKey('125ac290-5ff6-11ed-9b6a-0242ac120002');
  await addKey('125ac3ee-5ff6-11ed-9b6a-0242ac120002');
  await addKey('125ac54c-5ff6-11ed-9b6a-0242ac120002');
})();
