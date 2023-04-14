import {useState, useEffect} from 'react';
import {Button, Dropdown, DropdownButton} from '@/components/bootstrap';
import {FaPlus, FaArrowDown, FaArrowUp} from 'react-icons/fa';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {setActivePage, setSearchStr, setSortDirection, setSortBy, setFilterBy} from '@/reducers/filterSlice';

import SORT_BY from '@/constants/sortBy';

import config from '@/config';
import optionHelper from '@/helpers/optionHelper';

import Pagination from '@/components/common/Pagination';

import * as styled from './FilterBar.styled';

interface Props {
  total: number;
  entity: entityType;
  addNewEntityAction: () => void;
}

function FilterBar({total, entity, addNewEntityAction}: Props) {
  const dispatch = useAppDispatch();

  const activePage = useAppSelector(state => state.filter.activePage);
  const searchStr = useAppSelector(state => state.filter.searchStr);
  const sortAsc = useAppSelector(state => state.filter.sortAsc);
  const sortBy = useAppSelector(state => state.filter.sortBy);
  const filterBy = useAppSelector(state => state.filter.filterBy);

  const [searchStrLocal, setSearchStrLocal] = useState<string>(searchStr);
  const [sortByOptions, setSortByOptions] = useState<BasicOption[]>([]);
  const [filterByOptions, setFilterByOptions] = useState<any[]>([]);

  useEffect(() => {
    const sortOptions = optionHelper.getSortByOptions(entity);
    setSortByOptions(sortOptions);
    const filterOptions = optionHelper.getFilterByOptions(entity);
    setFilterByOptions(filterOptions);
  }, []);

  function onPageSelection(page: number) {
    dispatch(setActivePage(page));
  }

  function onSearchHandler() {
    dispatch(setSearchStr(searchStrLocal));
  }

  function onResetHandler() {
    setSearchStrLocal('');
    dispatch(setSearchStr(''));
    dispatch(setSortBy(SORT_BY.TITLE));
  }

  function onChangeSortDirection() {
    dispatch(setSortDirection(!sortAsc));
  }

  function onChangeSortOrder(value: string) {
    dispatch(setSortBy(value));
  }

  function onChangeFilterBy(value: number) {
    dispatch(setFilterBy(value));
  }

  function render() {
    const pageNumber = Math.ceil(total / config.pageSize);
    const paginationVisible = total > 0;

    const sortIcon = sortAsc ? <FaArrowDown /> : <FaArrowUp />;

    return (
      <styled.wrapper>
        <styled.sortByContainer xs={{span: 4, order: 1}} md={{span: 2, order: 1}} xl={{span: 2, order: 1}}>
          <DropdownButton title="Sort By: " id="sort-by-dropdown">
            {sortByOptions.map(option => {
              const value = option.value;

              return (
                <Dropdown.Item key={value} onClick={() => onChangeSortOrder(value)} active={sortBy === value}>
                  {option.label}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>

          <styled.sortByDirectionContainer onClick={onChangeSortDirection}>{sortIcon}</styled.sortByDirectionContainer>
        </styled.sortByContainer>

        <styled.addActionContainerContainer xs={{span: 8, order: 2}} md={{span: 1, order: 3}} xl={{span: 1, order: 4}}>
          <Button variant="success" onClick={addNewEntityAction}>
            <FaPlus />
          </Button>
        </styled.addActionContainerContainer>

        <styled.searchContainer xs={{span: 12, order: 3}} md={{span: 9, order: 2}} xl={{span: 4, order: 2}}>
          <styled.searchInput
            type="text"
            value={searchStrLocal}
            onChange={(event: any) => {
              setSearchStrLocal(event.target.value);
            }}
            onKeyPress={(event: any) => {
              if (event.key === 'Enter') {
                onSearchHandler();
              }
            }}
          />

          <styled.searchActionButton onClick={onSearchHandler}>Search</styled.searchActionButton>
          <styled.searchActionButton variant="secondary" onClick={onResetHandler}>
            Reset
          </styled.searchActionButton>
        </styled.searchContainer>

        <styled.paginationContainer xs={{span: 12, order: 4}} md={{span: 12, order: 4}} xl={{span: 5, order: 3}}>
          {paginationVisible && (
            <Pagination pageCount={pageNumber} activePage={activePage} onPageSelection={onPageSelection} />
          )}

          <DropdownButton variant="warning" title="Filter By: " id="filter-by-dropdown" style={{marginLeft: '10px'}}>
            {filterByOptions.map(option => {
              const value = option.value;

              return (
                <Dropdown.Item key={option.value} onClick={() => onChangeFilterBy(value)} active={filterBy === value}>
                  {option.label}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </styled.paginationContainer>
      </styled.wrapper>
    );
  }

  return render();
}

export default FilterBar;
