import { BaseInstanceData, useInstanceContext } from "@answeroverflow/discordjs-react"

export type InstanceData = {
foo: string
} & BaseInstanceData
export function setInstanceContextData(data: BaseInstanceData): InstanceData {
	return {
		...data,
		foo: "bar"
	}
}


export const useCustomInstanceData = () => {
	const ctx = useInstanceContext()
	return {
		...ctx,
		data: ctx.data as InstanceData
	}
}
