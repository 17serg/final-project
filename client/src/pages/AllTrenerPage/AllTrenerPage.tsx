import React, { useEffect, useState } from 'react'
import { UserApi } from '@/entities/user/api/UserApi'
import { IUserProfile } from './../../entities/user/model'
import TranerCard from '@/widgets/TranerCard/TranerCard'

export function AllTrenerPage(): React.JSX.Element {
const [ alltrener, setTraner ] = useState<IUserProfile[]>([])

useEffect(() => {
  const fetchTraners = async () => {
    try {
      const response = await UserApi.getAllTrenerProfile();
      setTraner(response.data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  fetchTraners();
}, []);
console.log(alltrener)


  return (
    <>
      <br />
        {alltrener.map((el) => (
          <TranerCard key={el.userId} char={el} />
        ))}
  </>
  )
}


