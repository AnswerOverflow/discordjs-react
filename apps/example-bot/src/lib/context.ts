import { useInstanceContext } from "@answeroverflow/discordjs-react"

export function setInstanceContextData<T extends {}>(data: T) {
	return {
		...data,
		foo: "bar"
	}
}

export type InstanceData = ReturnType<typeof setInstanceContextData>

export const useCustomInstanceData = () => {
	const { data } = useInstanceContext()
	return data as InstanceData
}
