import { MESSAGES, RANDOM_MOTIVATORS, pickRandomMessage } from '../data/messages';

function MotivationalMessage({ tone = 'neutral', customText = '' }) {
  let message = customText;

  if (!message) {
    if (tone === 'success') {
      message = pickRandomMessage(MESSAGES.success);
    } else if (tone === 'recovery') {
      message = pickRandomMessage(MESSAGES.recovery);
    } else if (tone === 'streak') {
      message = pickRandomMessage(MESSAGES.streak);
    } else {
      message = pickRandomMessage(RANDOM_MOTIVATORS);
    }
  }

  return <p className={`motivational-message ${tone}`}>{message}</p>;
}

export default MotivationalMessage;
