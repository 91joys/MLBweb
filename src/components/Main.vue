<template>
	<div :class="$style.position">
		<img :class="$style.baseballField1" alt="" src="@/assets/images/baseball-field.png" />
		<div :class="$style.parent">
			<img :class="$style.icon" alt="MLB Logo" src="@/assets/images/logo.svg" />
			<img :class="$style.t119HeaderPrimary1Icon" alt="Dodger Logo" src="@/assets/images/dodger-logo.svg" />
			<div :class="$style.groupChild" />
		</div>
		<div :class="$style.baseball1Parent">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div">1</div>
		</div>
		<div :class="$style.baseball1Group">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div1">
					<p :class="$style.p">2</p>
			</div>
		</div>
		<div :class="$style.baseball1Container">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div1">
					<p :class="$style.p">8</p>
			</div>
		</div>
		<div :class="$style.groupDiv">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div1">
					<p :class="$style.p">9</p>
			</div>
		</div>
		<div :class="$style.baseball1Parent1">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div1">7</div>
		</div>
		<div :class="$style.baseball1Parent2">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div1">6</div>
		</div>
		<div :class="$style.baseball1Parent3">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div1">5</div>
		</div>
		<div :class="$style.baseball1Parent4">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div1">
					<p :class="$style.p">4</p>
			</div>
		</div>
		<div :class="$style.baseball1Parent5">
			<img :class="$style.baseball1Icon" alt="" src="@/assets/images/baseball.png" />
			<div :class="$style.div1">3</div>
		</div>
  	</div>
</template>
<style  module>.baseballField1 {
  	position: absolute;
  	top: 111px;
  	left: 13px;
  	width: 1893px;
  	height: 1064px;
  	object-fit: cover;
}
  	.icon {
    		position: absolute;
    		top: 12.27px;
    		left: 0px;
    		border-radius: 10px;
    		width: 103.3px;
    		height: 54.9px;
    		overflow: hidden;
  	}
  	.t119HeaderPrimary1Icon {
    		position: absolute;
    		top: 0px;
    		left: 185.29px;
    		width: 131.7px;
    		height: 71.7px;
    		overflow: hidden;
  	}
  	.groupChild {
    		position: absolute;
    		top: 21.6px;
    		left: 142.97px;
    		border-right: 2px solid #fff;
    		box-sizing: border-box;
    		width: 2px;
    		height: 35.6px;
  	}
  	.parent {
    		position: absolute;
    		top: 41px;
    		left: 50px;
    		width: 317px;
    		height: 71.7px;
  	}
  	.baseball1Icon {
    		position: absolute;
    		top: 0px;
    		left: 0px;
    		width: 126px;
    		height: 126px;
    		object-fit: cover;
  	}
  	.div {
    		position: absolute;
    		top: 24px;
    		left: 36px;
    		font-weight: 500;
    		display: inline-block;
    		width: 54px;
    		height: 77px;
  	}
  	.baseball1Parent {
    		position: absolute;
    		top: 613px;
    		left: 897px;
    		width: 126px;
    		height: 126px;
  	}
  	.p {
    		margin: 0;
  	}
  	.div1 {
    		position: absolute;
    		top: 30px;
    		left: 36px;
    		font-weight: 500;
    		display: inline-block;
    		width: 54px;
    		height: 65px;
  	}
  	.baseball1Group {
    		position: absolute;
    		top: 814px;
    		left: 897px;
    		width: 126px;
    		height: 126px;
  	}
  	.baseball1Container {
    		position: absolute;
    		top: 320px;
    		left: 897px;
    		width: 126px;
    		height: 126px;
  	}
  	.groupDiv {
    		position: absolute;
    		top: 383px;
    		left: 387px;
    		width: 126px;
    		height: 126px;
  	}
  	.baseball1Parent1 {
    		position: absolute;
    		top: 383px;
    		left: 1300px;
    		width: 126px;
    		height: 126px;
  	}
  	.baseball1Parent2 {
    		position: absolute;
    		top: 613px;
    		left: 467px;
    		width: 126px;
    		height: 126px;
  	}
  	.baseball1Parent3 {
    		position: absolute;
    		top: 511px;
    		left: 682px;
    		width: 126px;
    		height: 126px;
  	}
  	.baseball1Parent4 {
    		position: absolute;
    		top: 511px;
    		left: 1112px;
    		width: 126px;
    		height: 126px;
  	}
  	.baseball1Parent5 {
    		position: absolute;
    		top: 613px;
    		left: 1327px;
    		width: 126px;
    		height: 126px;
  	}
  	.position {
    		width: 100%;
    		position: relative;
    		background-color: #005596;
    		border: 1px solid #000;
    		box-sizing: border-box;
    		height: 1080px;
    		overflow: hidden;
    		text-align: center;
    		font-size: 64px;
    		color: #fa1111;
    		font-family: 'Noto Sans TC';
  	}
</style>