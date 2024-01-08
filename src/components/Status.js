
export default function Status(props) {
    return (
        <div className="w-full mx-auto gap-4 flex lg:flex-row flex-col items-center justify-between text-center px-1 py-3">
            <StatusItem
                totalSoldAmount={props.totalSoldAmount}
                totalFundsInUSD={props.totalFundsInUSD}
                roundNumber={props.roundNumber}
                currentTokenPrice={props.currentTokenPrice}
                tokenBuyAmount={props.tokenBuyAmount}
                plsAmountFor1USD={props.plsAmountFor1USD}
                projectTokenBalance={props.projectTokenBalance}
                nextRoundStartTime={props.nextRoundStartTime}
            />
        </div>
    );
}
