import { HandPalm, Play } from "phosphor-react";
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, StopCountDownButton, TaskInput } from "./styles";
import { useForm } from 'react-hook-form'
import { differenceInSeconds } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from "react";

interface NewCycleFormData {
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptDate?: Date
}

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe nome da tarefa'),
    minutesAmount: zod
    .number()
    .min(5, 'O valor mínimo do ciclo é de 5 minutos')
    .max(60, 'O valor máximo do ciclo é de 60 minutos'),
})

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondPassed, setAmountSecondPassed] = useState(0)
    const { register, handleSubmit, watch, reset } = useForm({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    useEffect(() => {
        let interval: number;

        if(activeCycle) {
            interval = setInterval(() => {
                setAmountSecondPassed(differenceInSeconds(new Date(), activeCycle.startDate ))
            }, 1000)
        }
        return () => {
            clearInterval(interval)
        }
    }, [activeCycle])

    function handleCreateNewCycle(data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        setCycles((state) => [...state, newCycle])
        setActiveCycleId(newCycle.id)
        setAmountSecondPassed(0)
        reset()
    }

    function handleInterruptCycle() {
        setCycles(
            cycles.map(cycle => {
            if(cycle.id === activeCycleId) {
                return {...cycle, interruptDate: new Date()}
            } else {
                return cycle
            }
        }))
        setActiveCycleId(null)
    }

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60) 
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2,'0')

    useEffect(() => {
        if(activeCycle) {
            document.title =  `${minutes}:${seconds}`
        }
    },[minutes, seconds, activeCycle])

    const task = watch('task')
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        list="task-suggestions"
                        placeholder="Dê um nome ao seu projeto" 
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="Projeto 4" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00" 
                        step={5}
                        min={5}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountDownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>  
                </CountDownContainer>

                { activeCycle ? (
                    <StopCountDownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountDownButton>
                ): (
                    <StartCountDownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountDownButton>
                )}
            </form>
        </HomeContainer>
    )
}