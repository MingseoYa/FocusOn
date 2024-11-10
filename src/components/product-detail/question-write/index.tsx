import { FormProvider, useForm } from "react-hook-form";
import styles from "./styles.module.css";
import { TextareaSoftSFull } from "@/commons/ui/textarea";
import { useMutation } from "@apollo/client";
import { useParams } from "next/navigation";
import {
  CreateTravelproductQuestionDocument,
  FetchTravelproductQuestionsDocument,
} from "@/commons/graphql/graphql";

export default function ProductDetailQuestion() {
  const params = useParams();
  const travelproductId = params.productId as string;
  const [createTravelproductQuestion] = useMutation(
    CreateTravelproductQuestionDocument,
    {
      refetchQueries: [
        {
          query: FetchTravelproductQuestionsDocument,
          variables: { travelproductId },
        },
      ],
    }
  );
  const methods = useForm();
  const onClickQuestion = async (data) => {
    console.log(data);
    try {
      const result = await createTravelproductQuestion({
        variables: {
          createTravelproductQuestionInput: { contents: data.contents },
          travelproductId,
        },
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>문의</div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onClickQuestion)}>
          <TextareaSoftSFull
            name="contents"
            placeholder="문의사항을 입력해 주세요."
          />
          <div className={styles.button_container}>
            <button className={styles.button}>문의하기</button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}