import { Star } from 'lucide-react'
import React from 'react'

function Reviews() {
  return (
    <div className='p-6'> 
        {/* filter */}
        <div className='flex gap-2 mb-8'>
            <button className='bg-secondary text-primary hover:text-secondary hover:bg-primary text-[14px]  py-2 px-4 rounded-md font-semibold'>
              All
            </button>
            <button className='text-white bg-primary text-[14px]  py-2 px-4 rounded-md font-semibold'>
              New
            </button>
            <button className='bg-secondary text-primary hover:text-secondary hover:bg-primary text-[14px]  py-2 px-4 rounded-md font-semibold'>
              Not Replied
            </button>
            <button className='bg-secondary text-primary hover:text-secondary hover:bg-primary text-[14px]  py-2 px-4 rounded-md font-semibold'>
              Replied
            </button>
      </div>

        {/* reviews */}
        <div className='flex flex-col gap-8 w-3/4'>
            
            <div className='flex gap-4'>
                <div className='h-fit w-fit p-6  rounded-full bg-slate-200'>
                </div>
                <div>
                    <div className='mb-3'>
                        <h3 className='font-semibold'>Dawit Bekele</h3>
                        <p className='text-[14px] text-textgray'>12/11/2023</p>
                        <div className='flex gap-2'>
                            <p>4.8</p>
                            <div className='flex'>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                            </div>
                        </div>
                    </div>
                    <p className='text-textgray  mb-4'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae sit cumque magnam veritatis earum vitae nesciunt dolor veniam velit, eaque placeat consequuntur nam, neque, tempora voluptatem aspernatur ipsa perferendis obcaecati!
                    </p>
                    <p className='text-primary font-semibold'>Reply</p>
                </div>
            </div>
            <div className='flex gap-4'>
                <div className='h-fit w-fit p-6  rounded-full bg-slate-200'>
                </div>
                <div>
                    <div className='mb-3'>
                        <h3 className='font-semibold'>Dawit Bekele</h3>
                        <p className='text-[14px] text-textgray'>12/11/2023</p>
                        <div className='flex gap-2'>
                            <p>4.8</p>
                            <div className='flex'>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                            </div>
                        </div>
                    </div>
                    <p className='text-textgray  mb-4'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae sit cumque magnam veritatis earum vitae nesciunt dolor veniam velit, eaque placeat consequuntur nam, neque, tempora voluptatem aspernatur ipsa perferendis obcaecati!
                    </p>
                    <p className='text-primary font-semibold'>Reply</p>
                </div>
            </div>
            <div className='flex gap-4'>
                <div className='h-fit w-fit p-6  rounded-full bg-slate-200'>
                </div>
                <div>
                    <div className='mb-3'>
                        <h3 className='font-semibold'>Dawit Bekele</h3>
                        <p className='text-[14px] text-textgray'>12/11/2023</p>
                        <div className='flex gap-2'>
                            <p>4.8</p>
                            <div className='flex'>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                            </div>
                        </div>
                    </div>
                    <p className='text-textgray  mb-4'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae sit cumque magnam veritatis earum vitae nesciunt dolor veniam velit, eaque placeat consequuntur nam, neque, tempora voluptatem aspernatur ipsa perferendis obcaecati!
                    </p>
                    <p className='text-primary font-semibold'>Reply</p>
                </div>
            </div>
            <div className='flex gap-4'>
                <div className='h-fit w-fit p-6  rounded-full bg-slate-200'>
                </div>
                <div>
                    <div className='mb-3'>
                        <h3 className='font-semibold'>Dawit Bekele</h3>
                        <p className='text-[14px] text-textgray'>12/11/2023</p>
                        <div className='flex gap-2'>
                            <p>4.8</p>
                            <div className='flex'>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                            </div>
                        </div>
                    </div>
                    <p className='text-textgray  mb-4'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae sit cumque magnam veritatis earum vitae nesciunt dolor veniam velit, eaque placeat consequuntur nam, neque, tempora voluptatem aspernatur ipsa perferendis obcaecati!
                    </p>
                    <p className='text-primary font-semibold'>Reply</p>
                </div>
            </div>
            <div className='flex gap-4'>
                <div className='h-fit w-fit p-6  rounded-full bg-slate-200'>
                </div>
                <div>
                    <div className='mb-3'>
                        <h3 className='font-semibold'>Dawit Bekele</h3>
                        <p className='text-[14px] text-textgray'>12/11/2023</p>
                        <div className='flex gap-2'>
                            <p>4.8</p>
                            <div className='flex'>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                                <Star fill='orange'/>
                            </div>
                        </div>
                    </div>
                    <p className='text-textgray  mb-4'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae sit cumque magnam veritatis earum vitae nesciunt dolor veniam velit, eaque placeat consequuntur nam, neque, tempora voluptatem aspernatur ipsa perferendis obcaecati!
                    </p>
                    <p className='text-primary font-semibold'>Reply</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Reviews