import {useForm} from 'react-hook-form';

const Form = ({onSubmit, fields =[], title, className ='', reset_form =false,  messages ={}, children}) => {
    const {handleSubmit, formState: {errors}, register, reset} =useForm();
    const handleSubmission =async data =>{
        await onSubmit(data);
        if(reset_form) reset();
    }
    return (
        <form onSubmit={handleSubmit(handleSubmission)} className={`p-8 rounded-lg relative ${className}`}>
            {title && (<h2 className='text-center font-[500] uppercase text-3xl py-5'>{title}</h2>)}
            {fields.map(({type, name, label, placeholder, validations},index) =><div key={index}>
                <div className='mb-4 flex flex-col'>
                    {label && (<label htmlFor={name} className='block'>{label}</label>)}
                    {type =='textarea'? (<textarea rows={3} {...register(name, validations)} placeholder ={placeholder || ''} autoComplete='off' className={`block w-full border-[1px] resize-none bg-transparent border-[#0000001a] ${errors[name]? 'border-red-400': ''} rounded-lg p-4 focus:border-blue-400 transition-all`}></textarea>): 
                    (<input type={type || 'text'} {...register(name, validations)} placeholder ={placeholder || ''} autoComplete='off' className={`block px-4 py-2 outline-none border-[1px] border-gray-200 transition-colors duration-150 rounded bg-transparent focus:border-blue-300 ${errors[name] && 'border-red-400'} `}/>)}
                    {(errors[name] || messages[name]) && (<small className='block text-red-400'>{(errors[name]?.message || errors[name]) || messages[name]}</small>)}
                </div>
            </div>)}
            {children}
        </form>
    )
}

export default Form;