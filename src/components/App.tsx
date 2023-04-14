import {Routes, Route} from 'react-router-dom';
import {isEmpty} from 'lodash';
import styled from 'styled-components';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {confirmActionCancel, createEntityActionCancel} from '@/reducers/commonSlice';

import AppPage from '@/components/common/AppPage';
import Confirm from '@/components/common/Confirm';
import CreateEntityDialog from '@/components/common/CreateEntityDialog';
import ErrorBoundary from '@/components/error/ErrorBoundary';

import '@/styles/App.scss';

import {colors} from '@/styles/shared';

const StyledUiBlock = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: ${colors.black};
  opacity: 0.3;
  filter: alpha(opacity=30);
  z-index: 999;
`;

interface Props {
  routes: any[];
  children?: any;
}

function App(props: Props) {
  const dispatch = useAppDispatch();

  const asyncAction = useAppSelector(state => state.common.asyncActions);
  const confirmAction = useAppSelector(state => state.common.confirmAction);
  const createEntityAction = useAppSelector(state => state.common.createEntityAction);

  function cancelConfirmAction() {
    dispatch(confirmActionCancel());
  }

  function cancelCreateEntityAction() {
    dispatch(createEntityActionCancel());
  }

  function renderRoute(route, index: number) {
    const {pageProps, component: Component} = route;

    const wrapInAppPage = !isEmpty(pageProps);

    let render = props => <Component {...props} />;

    if (wrapInAppPage) {
      render = props => (
        <AppPage {...pageProps}>
          <Component {...props} />
        </AppPage>
      );
    }

    return <Route key={index} path={route.path} element={render(props)} />;
  }

  function render() {
    const showOverlay = isEmpty(asyncAction) ? false : true;

    return (
      <ErrorBoundary>
        {showOverlay && <StyledUiBlock />}

        {confirmAction && (
          <Confirm
            title={confirmAction.title}
            text={confirmAction.text}
            visible={true}
            action={async () => {
              cancelConfirmAction();
              await confirmAction.action();
            }}
            close={cancelConfirmAction}
          />
        )}

        {createEntityAction && (
          <CreateEntityDialog
            visible={true}
            entity={createEntityAction.entity}
            action={async entity => {
              cancelCreateEntityAction();
              await createEntityAction.action(entity);
            }}
            close={cancelCreateEntityAction}
          />
        )}

        <Routes>{props.routes.map((route, index: number) => renderRoute(route, index))}</Routes>

        {props.children}
      </ErrorBoundary>
    );
  }

  return render();
}

export default App;
