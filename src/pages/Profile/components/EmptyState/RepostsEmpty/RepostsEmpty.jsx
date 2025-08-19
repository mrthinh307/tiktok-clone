import EmptyState from '../EmptyState';
import { RepostIcon } from '~/assets/images/icons';

function RepostsEmpty() {
  return (
    <EmptyState
      icon={<RepostIcon />}
      title="No reposts yet"
      description="Reposts will appear here"
    />
  );
}

export default RepostsEmpty;
