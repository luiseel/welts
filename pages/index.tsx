import Column from "components/Column";
import Block from "components/Block";
import GameScreen from "components/GameScreen";

export default function Home() {
  return (
    <Column mode="lg">
      <Block>
        <GameScreen />
      </Block>
    </Column>
  );
}
