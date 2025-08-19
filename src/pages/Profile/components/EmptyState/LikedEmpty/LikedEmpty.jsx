import EmptyState from '../EmptyState';
import { LikedIcon } from '~/assets/images/icons';

function LikedEmpty() {
  return (
    <EmptyState
      icon={<LikedIcon />}
      title="No liked videos yet"
      description="Videos that this user liked will appear here"
    />
  );
}

export default LikedEmpty;
