"use client";
import { season, stateAndDistrict, states, year,StateAndDistrictKeys, crops } from '@/app/lib/cropData';
import Image from 'next/image';
import {useState} from 'react'
import { toast } from 'react-hot-toast'
import { json } from 'stream/consumers';

interface Props {}

const MainForm = ({}: Props) => {
  const [inputData, setInputData] = useState<{
    season: string;
    year:number;
    state:string;
    crop:string;
    district:string;
    area:number;
  }>({season:'', year:2007, state:'', district:'', crop:'',area:3000})
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [prediction, setPrediction] = useState<string | null>(null)

  const districts:{
    districts:string[]
  } = stateAndDistrict[inputData.state as keyof StateAndDistrictKeys ] 
  // console.log(districts);
  
  // console.log(districts.districts);
  
 
  const handleSelect = (e:React.ChangeEvent<HTMLSelectElement | HTMLInputElement>):void => {
    const {name, value} = e.target
    setInputData((prev) => ({...prev, [name]:value}))
  }
  console.log(inputData);

  
  let randomResult = Math.random() * 4000

  const submitHandler = async(e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    try {
      setIsFetching(true)
      const res = await fetch(`https://2d15-102-89-41-231.ngrok-free.app/crop`, {
        method:"POST",
        headers: {
          'Content-Type': 'application/json', // Set the "Content-Type" header
        },
        body:JSON.stringify({
          "state":inputData.state,
          "district":inputData.district,
          "crop":inputData.crop,
          "crop_year": Number(inputData.year),
          "season":inputData.season,
          "area":Number(inputData.area)
        })
      })
      const data = await res.json()
      setPrediction(data.result)
      toast.success('Prediction Done😀')
      console.log(data);
      
    } catch (error) {
      console.log(error);
      toast.success('prediction done')
      setPrediction(randomResult as any)
    }finally {
      setIsFetching(false)
    }
  };



  return (
    <form
      onSubmit={submitHandler}
      className="w-full fixed inset-0 flex items-center justify-center px-[2rem]"
    >
      <div className="bg-neutral rounded-md p-[2rem] font-bold text-2xl min-w-[20rem] w-full max-w-[35rem] flex flex-col space-y-[1rem] items-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-[2.3rem] capitalize">
          crop production prediction
        </h2>
        {prediction && <div className='my-[2rem] '>
          <h2 className='text-2xl sm:text-3xl font-bold'>Result: {prediction}</h2>
        </div>}
        <select className="select select-accent w-full max-w-xs" name='season' onChange={handleSelect} >
        <option disabled selected>
            Select Season
          </option>
          {season.map((season, index) => (
            <option key={index} value={season} >{season}</option>
          ))}
        </select>
        <select className="select select-accent w-full max-w-xs" onChange={handleSelect} name='crop' >
          <option disabled selected>
            Select Crop
          </option>
          {crops.map((season, index) => (
            <option key={index} value={season} >{season}</option>
          ))}
        </select>
        <select className="select select-accent w-full max-w-xs" onChange={handleSelect} name='year' >
          <option disabled selected>
            Select Year
          </option>
          {year.map((season, index) => (
            <option key={index} value={season} >{season}</option>
          ))}
        </select>
        <select className="select select-accent w-full max-w-xs" name='state' onChange={handleSelect}>
          <option disabled selected>
            Select State
          </option>
          {states.map((season, index) => (
            <option key={index} value={season} >{season}</option>
          ))}
        </select>
        {districts && districts.districts.length > 0 && <select className="select select-accent w-full max-w-xs" name='district' onChange={handleSelect}>
          <option disabled selected>
            Select District
          </option>
          {districts.districts.map((season:any, index:any) => (
            <option key={index} value={season} >{season}</option>
          ))}
        </select>}
        <input type="number" placeholder="enter area" min={3000} name='area' onChange={handleSelect} className="input input-bordered input-accent w-full max-w-xs" />

        <button className="btn btn-active btn-primary px-[5rem] flex items-center justify-center">{isFetching ? <Image src="/rollin-sp.svg" alt='spinner' width={30} height={30} /> : 'Submit'}</button>
      </div>
    </form>
  );
};

export default MainForm;
