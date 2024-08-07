// import { User } from 'firebase/auth';
// import { WordType } from '../../utils/constants';

import InternalWindow from '../internal-window';

type OwnCollectionProps = {
	userId: string;
};

export const OwnCollection = ({ userId }: OwnCollectionProps) => {
	console.log('USER_ID: ', userId);
	return (
		<InternalWindow
			title='YOUR OWN COLLECTION'
			mod='own-collection'
		></InternalWindow>
	);
};
