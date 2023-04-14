import {useState} from 'react';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {createEntityAction} from '@/reducers/commonSlice';

import PageWrapper from '@/components/common/PageWrapper';
import Counter from '@/components/common/Counter';
import FilterBar from '@/components/common/FilterBar';

function GamesPage() {
  const dispatch = useAppDispatch();

  const activePage = useAppSelector(state => state.filter.activePage);
  const searchStr = useAppSelector(state => state.filter.searchStr);
  const sortAsc = useAppSelector(state => state.filter.sortAsc);
  const sortBy = useAppSelector(state => state.filter.sortBy);
  const filterBy = useAppSelector(state => state.filter.filterBy);

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState<number>(0);

  async function addNewGameAction() {
    await dispatch(
      createEntityAction({
        entity: 'game',
        action: () => null
      })
    );
  }

  return (
    <PageWrapper>
      <FilterBar total={total} entity="game" addNewEntityAction={addNewGameAction} />

      <Counter total={total} title="Books" />
    </PageWrapper>
  );
}

export default GamesPage;
