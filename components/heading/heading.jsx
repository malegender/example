import Type from 'prop-types';
import { connect } from 'react-redux';
import Heading from 'arui-feather/heading';

import Spin from 'arui-feather/spin';
import { getCardTypeName } from '@/selectors/docs';

const HeadingDocs = ({ cardTypeName, spin }) => (
    <Heading size='m'>
        Выдача кредитной карты { !spin && cardTypeName }
        &nbsp;<Spin size='m' visible={ spin } />
    </Heading>
);

HeadingDocs.propTypes = {
    spin: Type.bool,
    cardTypeName: Type.string
};

export default connect(state => ({ cardTypeName: getCardTypeName(state) }))(HeadingDocs);
