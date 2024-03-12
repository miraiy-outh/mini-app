import { FC, useEffect, useRef } from 'react';
import { Button, Div, FormItem, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Textarea } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { useQuery } from '@tanstack/react-query';
import { findFirstSpaceIndex } from '../utils/find-first-space';

export const CatFact: FC<NavIdProps> = ({ id }) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const routeNavigator = useRouteNavigator();
    const { isPending, data, refetch } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
          fetch('https://catfact.ninja/fact').then((res) =>
            res.json(),
          ),
          enabled: false
      })

    useEffect(() => {
        if (inputRef.current && !isPending && data) {
            inputRef.current.focus();
            inputRef.current.selectionEnd = findFirstSpaceIndex(data.fact)
        }
    }, [isPending, data]);

    const handleClick = () => {
        refetch()
    }

    return (
        <Panel id={id}>
          <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
            Факт о котиках
          </PanelHeader>
          <FormItem htmlFor="cat-fact" top="Факт">
            <Textarea
                getRef={inputRef}
                id="cat-fact"
                placeholder="Пока тут ничего нет..."
                value={!isPending ? data.fact : ''}
            />
          </FormItem>
          <Div>
            <Button stretched size="l" mode="secondary" onClick={handleClick}>
                Покажите факт
            </Button>
          </Div>
          
        </Panel>
      );
}