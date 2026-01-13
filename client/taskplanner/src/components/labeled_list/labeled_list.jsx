import Label from "../label/label";

export default function LabeledList({children, label}) {
    return (
        <>
            <Label text={label}/>
            <ul>
                {children}
            </ul>
        </>
    )
}