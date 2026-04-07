import { formatNumber } from '@/lib/utils';
import { BadgeCounts } from '@/types/global';
import Image from 'next/image';

interface Props {
    totalQuestions: number;
    totalAnswers: number;
    badges: BadgeCounts;
}

interface StatcardProps {
    imgUrl: string;
    title: string;
    count: number;
}

// FIX 1: Removed stray <div></div>; wrapped paragraphs correctly inside the card div
const StatsCard = ({ imgUrl, title, count }: StatcardProps) => (
    <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200'>
        <Image
            src={imgUrl}
            alt={title}
            width={40}
            height={50}
        />
        <div>
            <p className='paragraph-semibold text-dark200_light900'>
                {formatNumber(count)}
            </p>
            <p className='body-medium text-dark400_light700'>
                {title}
            </p>
        </div>
    </div>
);

const Stats = ({ totalQuestions, totalAnswers, badges }: Props) => {
    return (
        <div className='mt-3'>
            <h4 className='h3-semibold text-dark200_light900'>Stats</h4>

            {/* FIX 2 & 3: All 4 grid children are now INSIDE the grid container */}
            <div className='mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4'>

                {/* Questions + Answers combined card */}
                <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200'>
                    <div>
                        <p className='paragraph-semibold text-dark200_light900'>
                            {formatNumber(totalQuestions)}
                        </p>
                        <p className='body-medium text-dark400_light700'>Questions</p>
                    </div>
                    <div>
                        <p className='paragraph-semibold text-dark200_light900'>
                            {formatNumber(totalAnswers)}
                        </p>
                        <p className='body-medium text-dark400_light700'>Answers</p>
                    </div>
                </div>

                {/* Badge cards — now inside the grid */}
                <StatsCard
                    imgUrl="/icons/gold-medal.svg"
                    title="Gold Badges"
                    count={badges.GOLD}
                />
                <StatsCard
                    imgUrl="/icons/silver-medal.svg"
                    title="Silver Badges"
                    count={badges.SILVER}
                />
                <StatsCard
                    imgUrl="/icons/bronze-medal.svg"
                    title="Bronze Badges"
                    count={badges.BRONZE}
                />

            </div>
        </div>
    );
};

export default Stats;