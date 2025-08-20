import EmptyState from '../EmptyState';
import { FavouriteIcon } from '~/assets/images/icons';

function FavouritesEmpty() {
  return (
    <EmptyState
      icon={<FavouriteIcon />}
      title="No favourite videos yet"
      description="Videos that this user favourited will appear here"
    />
  );
}

export default FavouritesEmpty;
