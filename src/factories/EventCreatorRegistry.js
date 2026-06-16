// Factory Method Pattern — Creator Registry
// Maps event type strings to their concrete creator instances.
// Callers hold an EventCreator reference without knowing the concrete subclass —
// that is the polymorphism the pattern requires.
import { LectureCreator }  from './LectureCreator';
import { ExamCreator }     from './ExamCreator';
import { MeetingCreator }  from './MeetingCreator';
import { DeadlineCreator } from './DeadlineCreator';
import { EVENT_TYPES }     from '../types/eventTypes';

const registry = {
  [EVENT_TYPES.LECTURE]:  new LectureCreator(),
  [EVENT_TYPES.EXAM]:     new ExamCreator(),
  [EVENT_TYPES.MEETING]:  new MeetingCreator(),
  [EVENT_TYPES.DEADLINE]: new DeadlineCreator(),
};

export function getCreator(type) {
  const creator = registry[type];
  if (!creator) throw new Error(`No creator registered for event type: "${type}"`);
  return creator;
}
