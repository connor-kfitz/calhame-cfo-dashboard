import { Alert as AlertContainer, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertProps {
	title: string;
	description: string;
}

export default function Alert({ title, description }: AlertProps) {
	return (
		<AlertContainer variant={"destructive"}>
      <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {description}
        </AlertDescription>
		</AlertContainer>
	);
}
