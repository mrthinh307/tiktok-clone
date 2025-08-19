import { ContentPreferencesIcon } from '~/assets/images/icons';
import EmptyState from '../EmptyState';

function VideosEmpty() {
  return (
    <EmptyState
      icon={<ContentPreferencesIcon />}
      title="No content"
      description="This user has not published any videos."
    />
  );
}

export default VideosEmpty;
