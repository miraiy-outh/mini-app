import { ChangeEvent, FC, useCallback, useState } from 'react';
import { Div, FormItem, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Textarea } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { useQuery } from '@tanstack/react-query';
import { debounce } from '../utils/debounce';

export const NameAge: FC<NavIdProps> = ({ id }) => {
    const [nameValue, setValue] = useState('')
    const routeNavigator = useRouteNavigator();
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
          fetch(`https://api.agify.io/?name=${nameValue}`).then((res) =>
            res.json(),
          ),
          enabled: false
      })
    
    if (isPending) console.log('Loading...') 

    if (error) console.log('An error has occurred: ' + error.message)

    const debounceRefetch = useCallback(debounce(refetch, 3000), [])

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value)
        debounceRefetch()
    }
      
    return (
        <Panel id={id}>
          <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
            Возраст по имени
          </PanelHeader>
          <FormItem htmlFor="name-age">
            <Textarea
                id="name-age"
                placeholder='Введите имя'
                onChange={handleInputChange}
            >{nameValue}</Textarea>
            
          </FormItem>

          <Div>
            {!isPending ? data.age : ''}
          </Div>
          
        </Panel>
      );
}