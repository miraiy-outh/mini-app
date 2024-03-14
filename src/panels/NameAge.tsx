import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { Div, FormItem, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Spinner, Textarea } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from '../utils/debounce';
import { useForm } from 'react-hook-form';
import { TAgeInfoData } from '../types';

export const NameAge: FC<NavIdProps> = ({ id }) => {
  const cache = useRef<Record<string, number | null>>({})
  const {register, setValue, getValues} = useForm()
  const [age, setAge] = useState<number | undefined | null>()
  const routeNavigator = useRouteNavigator();
  const queryClient = useQueryClient()
  const { isFetching,  data, refetch } = useQuery<TAgeInfoData>({
    queryKey: ['age'],
      queryFn: async ({signal}) =>
        fetch(`https://api.agify.io/?name=${getValues('nameAge')}`, {signal}).then((res) =>
          res.json(),
      ),
    enabled: false
  })

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue('nameAge', event.target.value)
    debounceRefetch()
  }

  const getAgeData = useCallback(() => {
    if (!cache.current[getValues('nameAge')]) {
      queryClient.cancelQueries({ queryKey: ['age'] })
      refetch()
    }
    else {
      setAge(cache.current[getValues('nameAge')])
    }
    
  }, []) 

  const debounceRefetch = useCallback(debounce(getAgeData, 3000), [])

  useEffect(() => {
    if (data) {
      cache.current[data.name] = data.age
      setAge(data.age)
    }
  }, [data])
      
  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Возраст по имени
      </PanelHeader>
      <FormItem htmlFor="nameAge">
        <Textarea
          id="nameAge"
          {...register('nameAge')}
          placeholder='Введите имя'
          onChange={handleInputChange}
        />
      </FormItem>
      {isFetching ? <Spinner size="medium" style={{ margin: '20px 0' }}/> : <Div>
        {age}
      </Div>}
      
    </Panel>
  );
}